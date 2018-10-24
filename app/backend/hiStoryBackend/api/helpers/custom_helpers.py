def errors_from_dict_to_arr(errors_dict):
    """
    :param errors_dict: {'key1': ['error1', 'error2', ...], 'key2': ['error1', ...], ...}
    :return: ['key1: error1', 'key1: error2', 'key1: error3', 'key2: error1', ... ]
    """
    non_field_errors_arr = errors_dict.pop('non_field_errors', [])

    result = [f"{key}: {msg}" for key in errors_dict for msg in errors_dict[key]]
    result.extend([msg for msg in non_field_errors_arr])

    return result
