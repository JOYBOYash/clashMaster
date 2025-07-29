
import { db } from './firebase';
import { collection, addDoc, getDocs, doc, setDoc, query, where, Timestamp, writeBatch, deleteDoc } from 'firebase/firestore';
import type { SuggestWarArmyOutput } from '@/ai/flows/suggest-war-army';

// Type for the army composition data
interface ArmyComposition {
    name: string;
    troops: { name: string; level: number; quantity: number }[];
    spells: { name: string; level: number; quantity: number }[];
    heroes: { name: string; level: number }[];
    siegeMachine: { name: string; level: number } | null;
    townHallLevel: number;
}

// === ARMY COMPOSITION FUNCTIONS ===

/**
 * Saves a user's army composition to their cookbook in Firestore.
 * @param userId - The UID of the user.
 * @param composition - The army composition object to save.
 */
export async function saveArmyComposition(userId: string, composition: ArmyComposition): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, 'users', userId, 'armyCompositions'), {
            ...composition,
            createdAt: Timestamp.now(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error saving army composition to Firestore:", error);
        throw new Error("Failed to save army composition.");
    }
}

/**
 * Fetches all saved army compositions for a specific user.
 * @param userId - The UID of the user.
 * @returns A promise that resolves to an array of saved army compositions.
 */
export async function getSavedArmyCompositions(userId: string): Promise<any[]> {
    try {
        const q = query(collection(db, 'users', userId, 'armyCompositions'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching army compositions from Firestore:", error);
        throw new Error("Failed to fetch saved armies.");
    }
}

// === AI STRATEGY FUNCTIONS ===

/**
 * Saves a generated AI strategy to the user's collection in Firestore.
 * @param userId - The UID of the user.
 * @param strategy - The AI strategy output object to save.
 */
export async function saveAIStrategy(userId: string, strategy: SuggestWarArmyOutput): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, 'users', userId, 'aiStrategies'), {
            ...strategy,
            createdAt: Timestamp.now(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error saving AI strategy to Firestore:", error);
        throw new Error("Failed to save AI strategy.");
    }
}

/**
 * Fetches all saved AI strategies for a specific user.
 * @param userId - The UID of the user.
 * @returns A promise that resolves to an array of saved AI strategies.
 */
export async function getSavedStrategies(userId: string): Promise<any[]> {
    try {
        const q = query(collection(db, 'users', userId, 'aiStrategies'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching AI strategies from Firestore:", error);
        throw new Error("Failed to fetch saved strategies.");
    }
}


// === USER DATA DELETION ===

/**
 * Deletes all data for a specific user, including subcollections.
 * @param userId - The UID of the user whose data should be deleted.
 */
export async function deleteUserData(userId: string): Promise<void> {
    const userDocRef = doc(db, 'users', userId);

    try {
        const batch = writeBatch(db);

        // Delete documents in 'armyCompositions' subcollection
        const armyCompositionsRef = collection(userDocRef, 'armyCompositions');
        const armyCompositionsSnapshot = await getDocs(armyCompositionsRef);
        armyCompositionsSnapshot.forEach(doc => batch.delete(doc.ref));
        
        // Delete documents in 'aiStrategies' subcollection
        const aiStrategiesRef = collection(userDocRef, 'aiStrategies');
        const aiStrategiesSnapshot = await getDocs(aiStrategiesRef);
        aiStrategiesSnapshot.forEach(doc => batch.delete(doc.ref));

        // After deleting subcollections, commit the batch
        await batch.commit();

        // Finally, delete the main user document itself
        await deleteDoc(userDocRef);

        console.log(`Successfully deleted all data for user ${userId}`);
    } catch (error) {
        console.error(`Error deleting user data for ${userId}:`, error);
        throw new Error("Failed to delete user data.");
    }
}
