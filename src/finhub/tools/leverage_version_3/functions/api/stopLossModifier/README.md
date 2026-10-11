A new tab in Configuration Panel next to : `Trading And Control` call it 
'Stop Loss Modifier'

to make conditional logic we need following variable :
+ initial stop loss price , 
+ entry price , 
+ latest_price, 
+ new_stop_loss_value
+ latest_price, 
+ initial stop loss value difference in pips , 
+ initial_sl_distance = entry price - initial_stop loss price 
+ latest_sl_distance_with_initial_sl_value = latest_price - initial_stop loss price (do the absolute difference for short type trades)


+ latest_reward_factor : needs calculation when conditional trailing enabled.

==> Trail Stop Loss Feature Straight Forward Way :
```

option 1: Activate the stop loss trail after latest price crosses breakeven.

option 2: Activate the stop loss trail initially and trail stop loss till stop loss value reaches the breakeven value.

```


Feature Extension of initial feature : 
```

is_conditional_trail_sl_valid(config, trade_info, direction, sl):
        """ If Stop Loss stays below the trail price target then trailing is allowed """

        # config['conditional_trail_sl']

        if direction is None: return False
        direction = 1 if direction == 'long' else -1
        
        if config['conditional_trail_sl']:
            if direction == 1:
                if sl < trade_info['trail_price_target'] : return True

            elif direction ==-1:
                if sl > trade_info['trail_price_target'] : return True                
        
        
        return False

```



Second feature to add is use of bypassing trail stop loss with direct stop loss modification between ranges: 

+ explicitAdjustFactor : 0.68


+ isStopLossModification
  
  ``` 
  if direction == 1: 
            if trade_info['min_tp_target'] <= last_close_price <= trade_info['max_tp_target']:
                diff = abs(trade_info['entry_price'] - last_close_price) * config['stop_level']
                sl = trade_info['entry_price'] + diff
                # trade_info['action'] = 'update_sl'
        
        elif direction == -1:
            if trade_info['min_tp_target'] >= last_close_price >= trade_info['max_tp_target']:
                diff = (trade_info['entry_price']) - (abs(last_close_price - trade_info['entry_price']) * config['stop_level'])
                sl = trade_info['entry_price'] - diff

                ```

+ isStopLossTrailing (same variable that is also being used in trading and control tab given in the checkbox )

if latest_sl_distance_with_initial_sl_value / initial_sl_distance = 2 assume it's (this will act our latest_reward_factor)

For explicit stop loss modification mode we observe this latest_reward_factor so whenever it's in these bound target then boundTarget is True.
lowerBoundTarget (min_tp_target) let's say is 2 ,  upperBoundTarget (max_tp_target) let's say is 4, 


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
