import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

//get all the consts
import { BOOKS_COLLECTION, LESSONS_COLLECTION, READERS_COLLECTION } from "./utils"
import * as actions from './actions/index'
import { user } from 'firebase-functions/lib/providers/auth';

//init the firebase app
admin.initializeApp()

//export the instance of firestore from firebase app
export const firestoreInstance = admin.firestore()

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const onNewuserCreated = functions.auth.user().onCreate((newUser) => {
    return actions.onNewUserCreated(newUser)
})

export const newReaderAdded = functions.firestore
    .document(`${BOOKS_COLLECTION}/{sessionId}/${LESSONS_COLLECTION}/{lessonId}/${READERS_COLLECTION}/{docId}`)
    .onCreate((snap, context) => {
        return actions.updateReadersCount(snap, context)
    })