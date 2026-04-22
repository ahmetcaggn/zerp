package org.zerp.common.resource.controller;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.context.RequestContext;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.resource.service.IResourceService;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Abstract base controller providing standard CRUD operations for resources. This automatically calls related service
 * methods.
 * <p>
 * Extend this class and implement the {@link #getService()} method to provide the specific service for your resource.
 *
 * @param <T>  the Response DTO type for this resource
 * @param <LT> the Response DTO type for getList and getManyReference operation.
 * @param <C>  the Create DTO type for this resource
 * @param <ID> the type of the entity's identifier
 */
public abstract class ResourceController<T, LT, C, U, ID> implements IResourceController<T, LT, C, U, ID> {
    private static final Log log = LogFactory.getLog(ResourceController.class);

    protected abstract IResourceService<T, LT, C, U, ID> getService();

    private static final List<String> RESERVED_PARAMS = List.of(
            "_start", "_end", "_sort", "_order", "_embed"
    );

    @Value("${app.version:0.0.1-SNAPSHOT}")
    private String appVersion;

    @Override
    public ResponseEntity<ApiResponse<List<LT>>> getList(
            int _start,
            int _end,
            String _sort,
            String _order,
            String _embed,
            Map<String, String> allParams
    ) {
        // Validate Pagination Parameters if "getList"
        if (_start < 0 || _end < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "_start and _end parameters are null or smaller than 0. These parameters are required for `getList` operation.");
        } else if (_end <= _start) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "_end parameter must be greater than _start parameter.");
        }

        // Calculate Pagination
        int pageSize = _end - _start;
        int pageNumber = _start / pageSize;
        Sort sort = Sort.by(Sort.Direction.fromString(_order), _sort);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        // Handle _embed Parameter
        if (_embed != null) {
            log.warn("_embed parameter is not supported and will be ignored.");
        }

        // Refine params and fetch Data
        RESERVED_PARAMS.forEach(allParams.keySet()::remove);
        Page<LT> pageResult = getService().findWithFilters(allParams, pageable);

        // Set Headers
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Total-Count", String.valueOf(pageResult.getTotalElements()));
        headers.add(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "X-Total-Count");

        return new ResponseEntity<>(buildResponse(pageResult.getContent()), headers, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ApiResponse<List<T>>> getMany(List<ID> id) {
        if (id == null || id.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "id parameter is null or empty. This parameter is required for `getMany` operation.");
        }
        return ResponseEntity.ok(buildResponse(getService().findAllById(id)));
    }

    @Override
    public ResponseEntity<ApiResponse<T>> getOne(ID id) {
        return ResponseEntity.ok(buildResponse(getService().findById(id)));
    }

    @Override
    public ResponseEntity<ApiResponse<T>> create(C data) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(buildResponse(getService().create(data)));
    }

    @Override
    public ResponseEntity<ApiResponse<T>> patch(ID id, Map<String, Object> fields) {
        return ResponseEntity.ok(buildResponse(getService().patch(id, fields)));
    }

    @Override
    public ResponseEntity<ApiResponse<T>> update(ID id, U data) {
        return ResponseEntity.ok(buildResponse(getService().update(id, data)));
    }

    @Override
    public ResponseEntity<ApiResponse<List<ID>>> patchMany(List<ID> id, Map<String, Object> fields) {
        List<ID> ids = id != null ? id : Collections.emptyList();
        List<ID> updatedIds = getService().patchMany(ids, fields);
        return ResponseEntity.ok(buildResponse(updatedIds));
    }

    @Override
    public ResponseEntity<ApiResponse<Void>> delete(ID id) {
        getService().deleteById(id);
        return ResponseEntity.ok(buildResponse());
    }

    @Override
    public ResponseEntity<ApiResponse<List<ID>>> deleteMany(List<ID> id) {
        List<ID> ids = id != null ? id : Collections.emptyList();
        List<ID> deletedIds = getService().deleteMany(ids);
        return ResponseEntity.ok(buildResponse(deletedIds));
    }

    protected <R> ApiResponse<R> buildResponse() {
        Long durationMs = RequestContext.endTiming();
        return ApiResponse.<R>noContent()
                .withDurationMs(durationMs)
                .withVersion(appVersion);
    }

    protected <R> ApiResponse<R> buildResponse(R data) {
        Long durationMs = RequestContext.endTiming();
        return ApiResponse.success(data)
                .withDurationMs(durationMs)
                .withVersion(appVersion);
    }

    protected <R> ApiResponse<R> buildResponse(R data, String message) {
        Long durationMs = RequestContext.endTiming();
        return ApiResponse.success(data, message)
                .withDurationMs(durationMs)
                .withVersion(appVersion);
    }
}
