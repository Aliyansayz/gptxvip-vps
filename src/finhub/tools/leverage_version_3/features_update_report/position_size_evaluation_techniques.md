# Position Size Evaluation Techniques (Leverage Mode)

Effective position sizing is critical to risk management and long-term profitability in leveraged trading. This document details the diverse techniques available in Leverage Version 3 for evaluating and determining the appropriate position size for a trade entry.

## 1. Fixed Lot Sizing
The simplest approach to position sizing, where the user defines a static volume for every trade, regardless of distance to the stop loss or volatility.
- **Example:** Always executing trades with `0.01` lots (micro lot) or `1.00` lots (standard lot).
- **Pros:** Easy to track, consistent margin allocation.
- **Cons:** Risk is not normalized. A trade with a 100-pip stop loss carries twice the monetary risk of a trade with a 50-pip stop loss.

## 2. Fixed Percentage of Equity (Margin-Based)
Calculates position size based on allocating a fixed percentage of available equity to the required margin of the trade.
- **Example:** A trader opts to use 5% of their $10,000 account ($500) as margin for a position.
- **Mechanism:** Leverages instrument margin requirements to dictate maximum allowed exposure.
- **Pros:** Scales with account growth or drawdown.
- **Cons:** Does not factor in the actual Stop Loss distance, meaning the capital at risk upon liquidation could exceed the initial margin allocation.

## 3. Risk by ATR Pips (Stop Loss ATR Band Based Liquidation)
**STATUS: IMPLEMENTED**

This technique normalizes risk by dynamically calculating the lot size such that a hit to the **ATR (Average True Range) band-based Stop Loss** translates exactly to a user-specified percentage of capital loss. 

Instead of fixing the lot size or margin, this technique fixes the **Maximum Tolerable Loss** (e.g., 2%, 5%, or 15% of the account) and steps backwards to find the closest approximate lot size.

### Mechanism:
1. **Determine Risk Allowance:** Calculate the target dollar amount corresponding to the user-specified percentage of total equity. 
   *(e.g., 2% of $10,000 = $200 allowed risk).*
2. **Calculate Distance to Liquidation (ATR Stop Loss / Custom Override):** Use the active Stop Loss Indicator (ATR bands) to define the dynamic Stop Loss value. Find the distance between the Entry Price and the Stop Loss in pips.
   *(e.g., Average True Range * 1.5 multiplier = 40 pips SL).*
   *Fallback/Override:* If the Stop Loss Indicator is inactive, or if the user explicitly checks "Use Custom ATR Pips", a customizable explicit pip count (default 20 pips) is used instead of the runtime ATR measurement.
3. **Calculate Required Pip Value:** Divide the Risk Allowance by the Stop Loss Pips to find the monetary value per pip.
   *(e.g., $200 / 40 pips = $5.00 per pip).*
4. **Determine Closest Available Lot Size:** Translate the required pip value into standard asset lot volumes, rounding to the closest available broker-permitted lot step (e.g., 0.01 increments).
   *(e.g., if a Standard Lot ($10/pip) is 1.00, then $5/pip translates perfectly to 0.50 Lots).*

### Advantages:
- **Volatility Adjusted:** Wider ATR stop losses correctly trigger smaller position sizes, ensuring risk remains static across highly volatile and tightly consolidated markets alike.
- **Predictable Drawdowns:** By restricting max-loss to exact percentages (e.g., 2%), the impact of losing streaks is mathematically constrained. 
- **Automated Granularity:** The algorithm handles approximation, automatically snapping the optimal mathematical size to the nearest valid tradeable lot size allowed by standard broker liquidity rules.

## 4. Recurrent/Layered Scaling Sizes (Martingale/Anti-Martingale/Dynamic Risk ATR)
When recurrent trade modes are active, position evaluation factors in existing exposure or continuously re-evaluates risk on a per-entry basis. 
- **Weight Factor (Martingale/Layering):** Increases or decreases lot sizes on subsequent entries based on a fractional multiplier of the main trade lot size.
- **Floating Gain Percentage (Anti-Martingale/Pyramiding):** Subsequent lot sizes are funded using a percentage of the currently active floating (unrealized) profit.
- **Risk by ATR Pips (Dynamic Scaling):** The same Risk by ATR method used in mainline entries is evaluated at the exact moment the recurrent signal triggers. This sizes the new layer precisely so its standalone liquidation at the active ATR bounds equals the exact percentage of capital loss defined globally.
