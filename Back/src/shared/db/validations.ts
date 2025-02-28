import { EntityRepository, FilterQuery } from '@mikro-orm/core';

/**
 * Checks if a field value already exists in the repository, excluding a given ID.
 */
async function valueExists<T extends { id?: any }>(
    repository: EntityRepository<T>,
    field: keyof T,
    value: any,
    currentId?: any
): Promise<boolean> {
    if (!value) return false; // No need to check if the value is not provided

    const query: FilterQuery<T> = { [field]: value } as FilterQuery<T>;
    const existingRecord = await repository.findOne(query);

    return existingRecord ? (!currentId || existingRecord.id !== currentId) : false;
}

/**
 * Validates the uniqueness of multiple fields in a given entity.
 */
async function validateUniqueFields<T extends { id?: any }>(
    uniqueFieldsMap: Record<keyof T, EntityRepository<T>>,
    sanitizeInput: Partial<T>
): Promise<{ valid: boolean; messages: string[] }> {
    const errors = await Promise.all(
        Object.entries(uniqueFieldsMap).map(async ([field, repository]) => {
            const exists = await valueExists(repository, field as keyof T, sanitizeInput[field as keyof T], sanitizeInput.id);
            return exists ? `${String(field)} already exists.` : null;
        })
    );

    return {
        valid: errors.every(error => error === null),
        messages: errors.filter(error => error !== null) as string[],
    };
}

/**
 * Validates the existence of multiple IDs in the respective repositories.
 */
async function validateIdsExistence<T extends object>(
    repositoryMap: Record<keyof T, EntityRepository<any>>,
    sanitizeInput: Partial<T>
): Promise<{ valid: boolean; messages: string[] }> {
    const validations = await Promise.all(
        Object.entries(repositoryMap).map(async ([field, repo]) => {
            const repository = repo as EntityRepository<any>; // 🔹 Type Assertion
            const id = sanitizeInput[field as keyof T];
            
            if (id === undefined) return null; // No validation needed if field is missing

            const exists = await repository.findOne(id as any);
            return exists ? null : `The provided ${String(field)} does not exist.`;
        })
    );

    const errors = validations.filter((msg): msg is string => msg !== null);

    return {
        valid: errors.length === 0,
        messages: errors
    };
}

export { validateUniqueFields, validateIdsExistence };
