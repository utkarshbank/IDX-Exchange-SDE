\# Performance Notes: Property Search Query



\## Query analyzed



The most complex filter query the app runs: city + price range + beds + baths, sorted by price.



```sql

SELECT \* FROM rets\_property

WHERE L\_City = 'Irvine'

&#x20; AND L\_SystemPrice BETWEEN 300000 AND 900000

&#x20; AND L\_Keyword2 = 3

&#x20; AND LM\_Dec\_3 = 2

ORDER BY L\_SystemPrice DESC, id ASC

LIMIT 20;

```



\## What each EXPLAIN column means



| Column | Meaning |

|---|---|

| `id`, `select\_type` | Which SELECT this row describes. `SIMPLE` means no subqueries or unions. |

| `table` | The table this row is about. |

| `type` | How rows are found. `ALL` is a full table scan, `range` is an index range scan, `ref` is an index lookup on equal values, `const` is one row by primary key. Closer to `const` is faster. |

| `possible\_keys` | Indexes MySQL could use. |

| `key` | The index it actually chose. `NULL` means none. |

| `key\_len` | Bytes of the index used. For a composite index, this shows how many of its columns are in use. |

| `rows` | MySQL's estimate of how many rows it must examine. Lower is better. |

| `filtered` | Estimated percentage of examined rows that pass the remaining conditions. |

| `Extra` | Notes such as `Using index condition` (filtering inside the index), `Using where` (row-by-row filtering after the lookup), and `Using filesort` (sorting not served by an index). |



\## Results



| Version | `key` | `type` | `key\_len` | `rows` | `Extra` |

|---|---|---|---|---|---|

| City wrapped in `LOWER(TRIM())` | `idx\_beds\_baths` | ref | 9 | 17,064 | Using where; Using filesort |

| Plain `L\_City`, before new index | `idx\_city\_price` | range | 208 | 90 | Using index condition; Using where; Using filesort |

| Plain `L\_City`, after new index | `idx\_city\_beds\_baths\_price` | range | 217 | 3 | Using index condition; Using filesort |



\## Findings



1\. \*\*Wrapping a column in a function disables its index.\*\* `LOWER(TRIM(L\_City))` stopped MySQL from using any city index, so it fell back to the beds/baths index and checked about 17,000 rows one by one.

2\. \*\*The wrapper was unnecessary.\*\* `WHERE L\_City = 'irvine'` and the wrapped version both return 723 rows, because MySQL's default collation is case-insensitive. The app now uses `L\_City = ?` with the input trimmed in JavaScript.

3\. \*\*A composite index fits this query.\*\* `idx\_city\_beds\_baths\_price` puts the equality columns first (city, beds, baths) and the range/sort column last (price). `key\_len` rose from 208 to 217 because beds and baths are now part of the lookup, and `Using where` disappeared because the index handles every condition.

4\. \*\*`Using filesort` remains.\*\* The price filter is a range condition, so MySQL cannot also read rows in sorted order from the index. It only sorts a handful of rows here, so the cost is small.



\## Indexes added



```sql

CREATE INDEX idx\_city\_beds\_baths\_price ON rets\_property(L\_City, L\_Keyword2, LM\_Dec\_3, L\_SystemPrice);

CREATE INDEX idx\_listing\_date ON rets\_property(ListingContractDate);  -- sort by date listed

CREATE INDEX idx\_sqft ON rets\_property(LM\_Int2\_3);                    -- sort by square footage

```



Earlier indexes from Week 3: `idx\_city`, `idx\_zip`, `idx\_price`, `idx\_beds\_baths`, `idx\_city\_price`.



\## Request timing



A logging middleware in `server.js` prints the method, URL, status code and response time in ms for every request.

