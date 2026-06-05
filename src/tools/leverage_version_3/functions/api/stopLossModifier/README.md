A new tab in Configuration Panel next to : `Trading And Control` call it 
'Stop Loss Modifier'

to make conditional logic we need following variable :
+ initial stop loss price , 
+entry price , 
+latest_price, 
+new_stop_loss_value
+latest_price, 
+initial stop loss value difference in pips , 
+ initial_sl_distance = entry price - initial_stop loss price 
+ latest_sl_distance_with_initial_sl_value = latest_price - initial_stop loss price (do the absolute difference for short type trades)
+ latest_reward_factor : needs calculation when conditional trailing enabled.
+ explicitAdjustFactor : 0.68
+ isStopLossModification 
+ isStopLossTrailing (same variable that is also being used in trading and control tab given in the checkbox )

if latest_sl_distance_with_initial_sl_value / initial_sl_distance = 2 assume it's (this will act our latest_reward_factor)

For explicit stop loss modification mode we observe this latest_reward_factor so whenever it's in these bound target then boundTarget is True.
lowerBoundTarget let's say is 2 ,  upperBoundTarget let's say is 4, 

we redefine stop loss using explicitAdjustFactor : 0.68 means chose whatever value that is available between entry price and latest price difference , 
latest_entry_diff = latest_price - entry_price (do the absolute difference for short type trades)

apply the weight on this : 'latest_entry_diff' * explicitAdjustFactor 
it will give a value a bit below the latest price almost 33% less as the 
newStopLossvalue = 'latest_entry_diff' * explicitAdjustFactor if boundTarget  and isStopLossModification both true.

Checkbox : Enable stop loss conditional trailing
Trailing Condition: 
+ checkbox : allow trailing after breakeven means: stop loss indicator (whatever being used) gives the stop loss value higher than entry price. 

+ checkbox : allow trailing stop loss till certain reward factor threshold. (stop trailing after this condition satisfied) 
+ slider value upto 5x :  when entry price reaches 2x times the price from the initial stop loss, like the stop loss initial was 55 pips now the trade is in gain of 110 pips or more it covered twice the distance from initial stop loss value.

Conclusion There are two types of conditional trailing stop losses : 
1) Enable Conditional Trailing Stop Loss Threshold Till X Reward Factor
2) Explicit Stop Loss Modification Till lower and upper bound reward factor with adjustmentFactor . 
