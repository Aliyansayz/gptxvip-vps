# Facility of Saving Trade Backtest Data Source Indicators

Add the facility of saving the json where it contains , 

Field: "trade_configs": "{ a dictionary where information of checkboxes their key and status true/false}" information of 

Field: "indicator_settings" : {"current active system and it's parameters info", "volatility indicators": "{it's parameters state}", "volatility regime": "{it's parameters state }", "stop_loss_indicators": "{it's parameters state }", "exit_signal_rule": "{it's parameters state }", "smoothing_indicators": "{it's parameters state }"  }

Field: "trade_settings": "{trade execution types checkboxes their key and status true/false, "main_trade parameters checkbox and input value fields" , "recurrent_trade parameters checkbox and input value fields" }

Field: "data_layer_config" : "{Asset Name, Preset Name too if available, Data Settings,  Timeframe, Candlesticks Chart }"

Field : "leverage_mode" : "{Initial Balance, Leverage Mode checkbox, Leverage Type Account, Position Sizing Type and each type fields info ,Recurrent Position Sizing Type and each type fields info"  }"

Field: "account_settings" : "{ associaetd fields info and their status true / off }"

Field: "visibility" : {"add checkboxes id and their status"}

Field : Final Balance and Final Equity Info

Field:  Trade History Book a key which in turn a list: where it will have timestamp as sub key and in it's a dictionary value the information of each trade and it's parameters.
