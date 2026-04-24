package org.zerp.common.resource.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

/**
 * Generic interface for CRUD operations on entities with support for filtering, pagination, and bulk operations.
 * <p>
 * Use an implementation of this interface in your controller implementations to handle standard data operations.
 *
 * @param <T>  the Response DTO type for this resource
 * @param <LT> the Response DTO type for getList and getManyReference operation.
 * @param <C>  the Create DTO type for this resource
 * @param <U>  the Update DTO type for this resource (if needed, otherwise can be same as C)
 * @param <ID> the type of the entity's identifier
 */
@SuppressWarnings("UnusedReturnValue")
public interface IResourceService<T, LT, C, U, ID> {
    /**
     * Finds entities matching the given filters and global search query.
     *
     * @param filters  A map of field names to values (e.g., "status" -> "active").
     * @param pageable Pagination and sorting information.
     * @return A page of entities.
     */
    Page<LT> findWithFilters(Map<String, String> filters, Pageable pageable);

    /**
     * Retrieves all entities by their IDs.
     *
     * @param ids The collection of entity IDs to retrieve.
     * @return A list of entities matching the given IDs.
     */
    List<T> findAllById(List<ID> ids);

    /**
     * Retrieves a single entity by its ID.
     *
     * @param id The ID of the entity to retrieve.
     * @return The entity with the given ID, or null if not found.
     */
    T findById(ID id);

    /**
     * Creates a new entity.
     *
     * @param data The entity data to save.
     * @return The saved entity.
     */
    T create(C data);

    /**
     * Updates specific fields of an existing entity.
     *
     * @param id   The ID of the entity to update.
     * @param data A map of field names to their new values to update on the entity.
     * @return The updated entity.
     */
    T patch(ID id, Map<String, Object> data);

    /**
     * Updates all fields of an existing entity.
     *
     * @param id   The ID of the entity to update.
     * @param data The dto of field names to their new values to update on the entity.
     * @return The updated entity.
     */
    T update(ID id, U data);

    /**
     * Updates multiple entities with the same field values.
     *
     * @param ids    The collection of entity IDs to update.
     * @param fields A map of field names to their new values to apply to all entities.
     * @return A list of IDs of the updated entities.
     */
    List<ID> patchMany(List<ID> ids, Map<String, Object> fields);

    /**
     * Deletes an entity by its ID.
     *
     * @param id The ID of the entity to delete.
     */
    void deleteById(ID id);

    /**
     * Deletes multiple entities by their IDs.
     *
     * @param ids The collection of entity IDs to delete.
     * @return A list of IDs of the deleted entities.
     */
    List<ID> deleteMany(List<ID> ids);
}
