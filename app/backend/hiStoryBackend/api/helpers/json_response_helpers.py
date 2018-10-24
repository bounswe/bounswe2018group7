from django.http import JsonResponse


def success(data_hash):
    return JsonResponse(
        data_hash,
        status=200,
        json_dumps_params={'ensure_ascii': False}
    )


def unauthorized(errors_arr):
    return error_response(errors_arr, 401)


def not_found(errors_arr):
    return error_response(errors_arr, 404)


def fail(errors_arr):
    return error_response(errors_arr, 400)  # Bad Request


def error_response(errors_arr, status_code):
    return JsonResponse(
        {'errors': errors_arr},
        status=status_code,
        json_dumps_params={'ensure_ascii': False}
    )
