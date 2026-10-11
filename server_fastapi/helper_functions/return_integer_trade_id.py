def func_return_integer_trade_id(data: str) -> int:
    """
    Convert string trade ID to integer.
    Separate the alphabetic part like
    'TD_123234' or it can be 'TD-1351685'
    
    separate 'TD' from '123234'
    and return the integer part of the trade ID
    """
    n = data.split('_')
    return int(n[-1])