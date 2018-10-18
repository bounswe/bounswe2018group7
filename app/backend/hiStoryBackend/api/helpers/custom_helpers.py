def parse_validation_error(validation_error):
    error_messages_dict = validation_error.message_dict

    result = []

    for key in error_messages_dict:
        for msg in error_messages_dict[key]:
            result.append(f"{key}: {msg}")

    return result
