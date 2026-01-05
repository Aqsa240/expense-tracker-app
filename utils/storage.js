import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const COLLECTION_NAME = 'expenses';

/**
 * Get all expenses from Firestore
 * @returns {Promise<Array>} List of expenses
 */
export const getExpenses = async () => {
    try {
        console.log('Fetching expenses...');
        const expensesCol = collection(db, COLLECTION_NAME);

        // Temporarily removing orderBy to debug if it's an index issue
        // const q = query(expensesCol, orderBy('fullDate', 'desc')); 

        const expenseSnapshot = await getDocs(expensesCol);
        console.log(`Found ${expenseSnapshot.docs.length} documents`);

        const expenseList = expenseSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Manual sort since we removed query sort
        expenseList.sort((a, b) => {
            return new Date(b.fullDate) - new Date(a.fullDate);
        });

        return expenseList;
    } catch (e) {
        console.error('Error reading expenses from Firebase:', e);
        return [];
    }
};

/**
 * Add a new expense to Firestore
 * @param {Object} expense - The expense object (id property is ignored as Firestore generates it)
 */
export const addExpense = async (expense) => {
    try {
        // We don't need the local ID for creation, Firestore creates one.
        const { id, ...data } = expense;

        await addDoc(collection(db, COLLECTION_NAME), data);

        // Return the updated list to keep UI in sync immediately
        return await getExpenses();
    } catch (e) {
        console.error('Error adding expense to Firebase:', e);
        return [];
    }
};

/**
 * Remove an expense by ID from Firestore
 * @param {string} id - The ID of the expense to remove
 */
export const removeExpense = async (id) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        return await getExpenses();
    } catch (e) {
        console.error('Error removing expense from Firebase:', e);
        return [];
    }
};
