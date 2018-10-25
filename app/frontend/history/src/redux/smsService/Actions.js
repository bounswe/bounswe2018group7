import {
  FETCH_LISTS,
  FETCH_LISTS_SUCCESS,
  FETCH_LISTS_FAILURE,
  FETCH_LISTS_RESET,
  FETCH_CONTACT_LIST,
  FETCH_CONTACT_LIST_SUCCESS,
  FETCH_CONTACT_LIST_FAILURE,
  FETCH_CONTACT_LIST_RESET,
  FETCH_ALL_CONTACTS,
  FETCH_ALL_CONTACTS_SUCCESS,
  FETCH_ALL_CONTACTS_FAILURE,
  FETCH_ALL_CONTACTS_RESET,
  ADD_CONTACT_LIST,
  ADD_CONTACT_LIST_SUCCESS,
  ADD_CONTACT_LIST_FAILURE,
  ADD_CONTACT_LIST_RESET,
  DELETE_CONTACT_LIST,
  DELETE_CONTACT_LIST_SUCCESS,
  DELETE_CONTACT_LIST_FAILURE,
  DELETE_CONTACT_LIST_RESET,
  ADD_CONTACT,
  ADD_CONTACT_SUCCESS,
  ADD_CONTACT_FAILURE,
  ADD_CONTACT_RESET,
  DELETE_CONTACT,
  DELETE_CONTACT_SUCCESS,
  DELETE_CONTACT_FAILURE,
  DELETE_CONTACT_RESET,
  UPDATE_CONTACT,
  UPDATE_CONTACT_SUCCESS,
  UPDATE_CONTACT_FAILURE,
  UPDATE_CONTACT_RESET,
  SEND_SMS,
  SEND_SMS_SUCCESS,
  SEND_SMS_FAILURE,
  SEND_SMS_RESET
} from "./actionTypes";

export const fetchLists = () => ({
  type: FETCH_LISTS
});
export const fetchListsSuccess = res => ({
  type: FETCH_LISTS_SUCCESS,
  payload: res
});
export const fetchListsFailure = errorData => ({
  type: FETCH_LISTS_FAILURE,
  payload: errorData
});
export const fetchListsReset = () => ({
  type: FETCH_LISTS_RESET
});

export const fetchContactList = id => ({
  type: FETCH_CONTACT_LIST,
  payload: { id }
});
export const fetchContactListSuccess = res => ({
  type: FETCH_CONTACT_LIST_SUCCESS,
  payload: res
});
export const fetchContactListFailure = errorData => ({
  type: FETCH_CONTACT_LIST_FAILURE,
  payload: errorData
});
export const fetchContactListReset = () => ({
  type: FETCH_CONTACT_LIST_RESET
});

export const fetchAllContacts = () => ({
  type: FETCH_ALL_CONTACTS
});
export const fetchAllContactsSuccess = res => ({
  type: FETCH_ALL_CONTACTS_SUCCESS,
  payload: res
});
export const fetchAllContactsFailure = errorData => ({
  type: FETCH_ALL_CONTACTS_FAILURE,
  payload: errorData
});
export const fetchAllContactsReset = () => ({
  type: FETCH_ALL_CONTACTS_RESET
});

export const addContactList = name => ({
  type: ADD_CONTACT_LIST,
  payload: {
    name
  }
});
export const addContactListSuccess = res => ({
  type: ADD_CONTACT_LIST_SUCCESS,
  payload: {
    res
  }
});
export const addContactListFailure = errorData => ({
  type: ADD_CONTACT_LIST_FAILURE,
  payload: errorData
});
export const addContactListReset = () => ({
  type: ADD_CONTACT_LIST_RESET
});

export const deleteContactList = id => ({
  type: DELETE_CONTACT_LIST,
  payload: {
    id
  }
});
export const deleteContactListSuccess = () => ({
  type: DELETE_CONTACT_LIST_SUCCESS
});
export const deleteContactListFailure = errorData => ({
  type: DELETE_CONTACT_LIST_FAILURE,
  payload: errorData
});
export const deleteContactListReset = () => ({
  type: DELETE_CONTACT_LIST_RESET
});

export const addContact = (first_name, last_name, phone_numbers, emails) => ({
  type: ADD_CONTACT,
  payload: {
    first_name,
    last_name,
    phone_numbers,
    emails
  }
});
export const addContactSuccess = () => ({
  type: ADD_CONTACT_SUCCESS
});
export const addContactFailure = errorData => ({
  type: ADD_CONTACT_FAILURE,
  payload: errorData
});
export const addContactReset = () => ({
  type: ADD_CONTACT_RESET
});

export const deleteContact = id => ({
  type: DELETE_CONTACT,
  payload: {
    id
  }
});
export const deleteContactSuccess = () => ({
  type: DELETE_CONTACT_SUCCESS
});
export const deleteContactFailure = errorData => ({
  type: DELETE_CONTACT_FAILURE,
  payload: errorData
});
export const deleteContactReset = () => ({
  type: DELETE_CONTACT_RESET
});

export const updateContact = (id, ad, soyad, phone) => ({
  type: UPDATE_CONTACT,
  payload: {
    id,
    ad,
    soyad,
    phone
  }
});
export const updateContactSuccess = () => ({
  type: UPDATE_CONTACT_SUCCESS
});
export const updateContactFailure = errorData => ({
  type: UPDATE_CONTACT_FAILURE,
  payload: errorData
});
export const updateContactReset = () => ({
  type: UPDATE_CONTACT_RESET
});

export const sendSMS = () => ({
  type: SEND_SMS
});
export const SEND_SMSSuccess = (listIds, body, date, time) => ({
  type: SEND_SMS_SUCCESS,
  payload: { listIds, body, date, time }
});
export const SEND_SMSFailure = errorData => ({
  type: SEND_SMS_FAILURE,
  payload: errorData
});
export const SEND_SMSReset = () => ({
  type: SEND_SMS_RESET
});
