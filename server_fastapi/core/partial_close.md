Discussing Partial Close Logic (Lot Size: 0.03, Close Limit: 70%)
When you want to partially close an open position of 0.03 lots by 0.7 (70%)—meaning you want to close 7 parts and keep 3 parts—you run into broker constraints because MT5 usually strictly adheres to a volume_step (commonly 0.01).

Here is how you handle it using absolute fractioning limitations alongside ceiling/rounding techniques:

1. The Mathematical Calculation: The exact amount you'd want to close mathematically is 0.03 * 0.7 = 0.021 lots. The exact amount you'd want to keep is 0.03 * 0.3 = 0.009 lots.

Because 0.021 and 0.009 are not valid lot sizes under a 0.01 step size, MetaTrader will reject the order. You must normalize the volume.

2. The Ceiling/Rounding Technique: If you directly apply a standard math.ceil to the closure amount (ceil(0.021 / 0.01) * 0.01), you end up with 0.03. Closing 0.03 would close the entire trade, meaning you keep 0 parts instead of 3 parts.

To safely ensure you close as close to 7 parts as possible while guaranteeing you keep the remaining 3 parts alive, you can calculate what to keep rather than just what to close:

Volume to keep: Calculate the leftover percentage (30%) and use a ceiling approach to ensure it doesn't hit 0. math.ceil((0.03 * 0.3) / 0.01) * 0.01 = math.ceil(0.9) * 0.01 = 0.01
Volume to close: Subtract the calculated kept volume from the original lot size. 0.03 - 0.01 = 0.02
3. The Result: By sending a partial close order of 0.02, you successfully close exactly 2 parts (~66.6% of the trade) and securely leave 0.01 running in the market.

This approach gracefully handles cases where exact 7:3 splitting is mathematically impossible by using the ceiling approach on the remaining portion to protect it from being fully closed out.


**Conclusion** :

When selecting lot size, 
+ first check volume to close is exactly available or not if not then try to find nearest lot size to close. then 
+ check volume to keep is available and it is eligible volume, then 
+ if volume to close is eligible and is near the lot partial close limit,
+  
==> if partial close lot size < partial close limit
    simply close that partial lot size to close if eligible.
    if partial close lot size is not eligible then adjust lot size to the nearest eligible lot size that satisfies the condition.
    if lot size to close is eligible and near the lot partial close limit then also check lot size to keep is eligible.
    when both lot size to close and lot size to keep are eligible then close the trade.
    Otherwise Cancle process

==> if partial close lot size > partial close limit 
    make sure lot size to close if exist then also lot size to keep also eligible otherwise cancel process.




, it is fine to close the trade.  
+ if both are not eligible, then adjust lot size to the nearest eligible lot size that satisfies the condition.