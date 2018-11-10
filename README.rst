ToDo:
Change DocRefs from strings to real References
Object Value References
    When using objects for select values, it is possible for the identities of these objects to change if they are coming from a server or database, while the selected value's identity remains the same. For example, this can occur when an existing record with the desired object value is loaded into the select, but the newly retrieved select options now have different identities. This will result in the select appearing to have no value at all, even though the original selection in still intact.


add-record
    When new user is added while adding a record, buyers and payers will be overwritten by "walletMembersCollection.snapshotChanges()"