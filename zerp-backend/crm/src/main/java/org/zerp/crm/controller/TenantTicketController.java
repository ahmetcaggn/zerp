package org.zerp.crm.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.crm.dto.ticket.CreateTicketRequest;
import org.zerp.crm.dto.ticket.TicketResponse;
import org.zerp.crm.dto.ticket.UpdateTicketRequest;
import org.zerp.crm.service.TicketService;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/crm/tickets")
@Tag(name = "Tenant Tickets", description = "APIs for tenant-facing ticket operations")
public class TenantTicketController extends ResourceController<TicketResponse, TicketResponse,
        CreateTicketRequest, UpdateTicketRequest, UUID> {

    private static final Set<String> TENANT_PATCH_ALLOWED_FIELDS = Set.of(
            "title", "description", "type", "tags", "customAttributes"
    );

    private final TicketService ticketService;

    public TenantTicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @Override
    protected TicketService getService() {
        return ticketService;
    }

    @Override
    @PatchMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<TicketResponse>> patch(
            @PathVariable(name = "id") UUID id,
            @RequestBody Map<String, Object> fields) {
        validateTenantPatchFields(fields);
        return super.patch(id, fields);
    }

    @Override
    @PatchMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<List<UUID>>> patchMany(
            @RequestParam(name = "id", required = false) List<UUID> id,
            @RequestBody Map<String, Object> fields) {
        validateTenantPatchFields(fields);
        return super.patchMany(id, fields);
    }

    @Override
    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable(name = "id") UUID id) {
        throw new ResponseStatusException(
                HttpStatus.METHOD_NOT_ALLOWED,
                "Ticket deletion is not allowed for tenant endpoint"
        );
    }

    @Override
    @DeleteMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<List<UUID>>> deleteMany(
            @RequestParam(name = "id", required = false) List<UUID> id) {
        throw new ResponseStatusException(
                HttpStatus.METHOD_NOT_ALLOWED,
                "Bulk ticket deletion is not allowed for tenant endpoint"
        );
    }

    private void validateTenantPatchFields(Map<String, Object> fields) {
        if (fields == null || fields.isEmpty()) {
            return;
        }

        for (String key : fields.keySet()) {
            if (!TENANT_PATCH_ALLOWED_FIELDS.contains(key)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Field cannot be patched by tenant endpoint: " + key
                );
            }
        }
    }
}
