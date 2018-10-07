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
  DELETE_CONTACT,
  DELETE_CONTACT_SUCCESS,
  DELETE_CONTACT_FAILURE,
  DELETE_CONTACT_RESET,
  UPDATE_CONTACT,
  UPDATE_CONTACT_SUCCESS,
  UPDATE_CONTACT_FAILURE,
  UPDATE_CONTACT_RESET,
  ADD_CONTACT,
  ADD_CONTACT_SUCCESS,
  ADD_CONTACT_FAILURE,
  ADD_CONTACT_RESET,
  SEND_SMS,
  SEND_SMS_SUCCESS,
  SEND_SMS_FAILURE,
  SEND_SMS_RESET
} from "./actionTypes";

const initialState = {
  customerLists: [],
  fetchListsInProgress: false,
  fetchListsHasError: false,
  fetchListsCompleted: false,
  fetchListsError: "",

  specificContactList: [],
  fetchContactListInProgress: false,
  fetchContactListHasError: false,
  fetchContactListCompleted: false,
  fetchContactListError: "",

  allContacts: [],
  fetchAllContactsInProgress: false,
  fetchAllContactsHasError: false,
  fetchAllContactsCompleted: false,
  fetchAllContactsError: "",

  addContactListInProgress: false,
  addContactListHasError: false,
  addContactListCompleted: false,
  addContactListError: "",
  addContactList: [],

  deleteContactListInProgress: false,
  deleteContactListHasError: false,
  deleteContactListCompleted: false,
  deleteContactListError: "",

  addContactInProgress: false,
  addContactHasError: false,
  addContactCompleted: false,
  addContactError: "",

  deleteContactInProgress: false,
  deleteContactHasError: false,
  deleteContactCompleted: false,
  deleteContactError: "",

  updateContactInProgress: false,
  updateContactHasError: false,
  updateContactCompleted: false,

  sendSMSInProgress: false,
  sendSMSHasError: false,
  sendSMSCompleted: false
};

export default function(state = initialState, action) {
  const { payload } = action;
  if (action.type === FETCH_LISTS) {
    return {
      ...state,
      fetchListsInProgress: true,
      fetchListsHasError: false,
      fetchListsCompleted: false
    };
  } else if (action.type === FETCH_LISTS_SUCCESS) {
    return {
      ...state,
      customerLists: payload,
      fetchListsInProgress: false,
      fetchListsHasError: false,
      fetchListsCompleted: true
    };
  } else if (action.type === FETCH_LISTS_FAILURE) {
    return {
      ...state,
      fetchListsInProgress: false,
      fetchListsHasError: true,
      fetchListsCompleted: true,
      fetchListsError: payload.detail
    };
  } else if (action.type === FETCH_LISTS_RESET) {
    return {
      ...state,
      fetchListsInProgress: false,
      fetchListsHasError: false,
      fetchListsCompleted: false
    };
  } else if (action.type === FETCH_ALL_CONTACTS) {
    return {
      ...state,
      fetchAllContactsInProgress: true,
      fetchAllContactsHasError: false,
      fetchAllContactsCompleted: false
    };
  } else if (action.type === FETCH_ALL_CONTACTS_SUCCESS) {
    return {
      ...state,
      allContacts: payload,
      fetchAllContactsInProgress: false,
      fetchAllContactsHasError: false,
      fetchAllContactsCompleted: true
    };
  } else if (action.type === FETCH_ALL_CONTACTS_FAILURE) {
    return {
      ...state,
      fetchAllContactsInProgress: false,
      fetchAllContactsHasError: true,
      fetchAllContactsCompleted: true,
      fetchAllContactListError: payload.detail[0]
    };
  } else if (action.type === FETCH_ALL_CONTACTS_RESET) {
    return {
      ...state,
      fetchAllContactsInProgress: false,
      fetchAllContactsHasError: false,
      fetchAllContactsCompleted: false
    };
  } else if (action.type === FETCH_CONTACT_LIST) {
    return {
      ...state,
      fetchContactListInProgress: true,
      fetchContactListHasError: false,
      fetchContactListCompleted: false
    };
  } else if (action.type === FETCH_CONTACT_LIST_SUCCESS) {
    return {
      ...state,
      specificContactList: payload,
      fetchContactListInProgress: false,
      fetchContactListHasError: false,
      fetchContactListCompleted: true
    };
  } else if (action.type === FETCH_CONTACT_LIST_FAILURE) {
    return {
      ...state,
      fetchContactListInProgress: false,
      fetchContactListHasError: true,
      fetchContactListCompleted: true,
      fetchContactListError: payload.detail
    };
  } else if (action.type === FETCH_CONTACT_LIST_RESET) {
    return {
      ...state,
      fetchContactListInProgress: false,
      fetchContactListHasError: false,
      fetchContactListCompleted: false
    };
  } else if (action.type === ADD_CONTACT_LIST) {
    return {
      ...state,

      addContactListInProgress: true,
      addContactList: payload,
      addContactListHasError: false,
      addContactListCompleted: false
    };
  } else if (action.type === ADD_CONTACT_LIST_SUCCESS) {
    return {
      ...state,
      addContactListInProgress: false,
      addContactListHasError: false,
      addContactListCompleted: true
    };
  } else if (action.type === ADD_CONTACT_LIST_FAILURE) {
    return {
      ...state,
      addContactListInProgress: false,
      addContactListHasError: true,
      addContactListCompleted: true,
      addContactListError: payload.detail[0]
    };
  } else if (action.type === ADD_CONTACT_LIST_RESET) {
    return {
      ...state,
      addContactListInProgress: false,
      addContactListHasError: false,
      addContactListCompleted: false
    };
  } else if (action.type === DELETE_CONTACT_LIST) {
    return {
      ...state,
      deleteContactListInProgress: true,
      deleteContactListHasError: false,
      deleteContactListCompleted: false
    };
  } else if (action.type === DELETE_CONTACT_LIST_SUCCESS) {
    return {
      ...state,
      deleteContactListInProgress: false,
      deleteContactListHasError: false,
      deleteContactListCompleted: true
    };
  } else if (action.type === DELETE_CONTACT_LIST_FAILURE) {
    return {
      ...state,
      deleteContactListInProgress: false,
      deleteContactListHasError: true,
      deleteContactListCompleted: true,
      deleteContactListError: payload.detail[0]
    };
  } else if (action.type === DELETE_CONTACT_LIST_RESET) {
    return {
      ...state,
      deleteContactListInProgress: false,
      deleteContactListHasError: false,
      deleteContactListCompleted: false
    };
  } else if (action.type === ADD_CONTACT) {
    return {
      ...state,
      addContactInProgress: true,
      addContactHasError: false,
      addContactCompleted: false
    };
  } else if (action.type === ADD_CONTACT_SUCCESS) {
    return {
      ...state,
      addContactInProgress: false,
      addContactHasError: false,
      addContactCompleted: true
    };
  } else if (action.type === ADD_CONTACT_FAILURE) {
    return {
      ...state,
      addContactInProgress: false,
      addContactHasError: true,
      addContactCompleted: true,
      addContactError: payload.detail[0]
    };
  } else if (action.type === ADD_CONTACT_RESET) {
    return {
      ...state,
      addContactInProgress: false,
      addContactHasError: false,
      addContactCompleted: false
    };
  } else if (action.type === DELETE_CONTACT) {
    return {
      ...state,
      deleteContactInProgress: true,
      deleteContactHasError: false,
      deleteContactCompleted: false
    };
  } else if (action.type === DELETE_CONTACT_SUCCESS) {
    return {
      ...state,
      deleteContactInProgress: false,
      deleteContactHasError: false,
      deleteContactCompleted: true
    };
  } else if (action.type === DELETE_CONTACT_FAILURE) {
    return {
      ...state,
      deleteContactInProgress: false,
      deleteContactHasError: true,
      deleteContactCompleted: true,
      deleteContactError: payload.detail[0]
    };
  } else if (action.type === DELETE_CONTACT_RESET) {
    return {
      ...state,
      deleteContactInProgress: false,
      deleteContactHasError: false,
      deleteContactCompleted: false
    };
  } else if (action.type === UPDATE_CONTACT) {
    return {
      ...state,
      updateContactInProgress: true,
      updateContactHasError: false,
      updateContactCompleted: false
    };
  } else if (action.type === UPDATE_CONTACT_SUCCESS) {
    return {
      ...state,
      updateContactInProgress: false,
      updateContactHasError: false,
      updateContactCompleted: true
    };
  } else if (action.type === UPDATE_CONTACT_FAILURE) {
    return {
      ...state,
      updateContactInProgress: false,
      updateContactHasError: true,
      updateContactCompleted: true
    };
  } else if (action.type === UPDATE_CONTACT_RESET) {
    return {
      ...state,
      updateContactInProgress: false,
      updateContactHasError: false,
      updateContactCompleted: false
    };
  } else if (action.type === SEND_SMS) {
    return {
      ...state,
      sendSMSInProgress: true,
      sendSMSHasError: false,
      sendSMSCompleted: false
    };
  } else if (action.type === SEND_SMS_SUCCESS) {
    return {
      ...state,
      sendSMSInProgress: false,
      sendSMSHasError: false,
      sendSMSCompleted: true
    };
  } else if (action.type === SEND_SMS_FAILURE) {
    return {
      ...state,
      sendSMSInProgress: false,
      sendSMSHasError: true,
      sendSMSCompleted: true
    };
  } else if (action.type === SEND_SMS_RESET) {
    return {
      ...state,
      sendSMSInProgress: false,
      sendSMSHasError: false,
      sendSMSCompleted: false
    };
  }

  return state;
}
