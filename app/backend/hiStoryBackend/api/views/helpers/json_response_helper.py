from django.http import JsonResponse


def success(data_hash):
    return JsonResponse(data_hash, status=200)


# Use when there is a problem with request format, e.g. unsupported HTTP verb or missing request paramater
def bad_request(errors_arr):
    return error_response(errors_arr, 400)


def unauthorized(errors_arr):
    return error_response(errors_arr, 401)


def forbidden():
    return error_response(['You do not have the permission for this operation.'], 403)


def not_found(errors_arr):
    return error_response(errors_arr, 404)


# Use when a validation error occurs while updating a Model
def fail(errors_arr):
    return JsonResponse({'errors': errors_arr}, status=422)  # Unprocessable entity


def error_response(errors_arr, status_code):
    return JsonResponse({'errors': errors_arr}, status=status_code)
