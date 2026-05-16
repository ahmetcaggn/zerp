package org.zerp.crm.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.zerp.crm.dto.ticket.AttachmentResponse;
import org.zerp.crm.dto.ticket.TicketAttachmentContentResponse;
import org.zerp.crm.service.TicketService;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/crm/tickets")
@Tag(name = "Ticket Attachments", description = "APIs for ticket attachment upload and download")
public class TicketAttachmentController {

    private final TicketService ticketService;

    public TicketAttachmentController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping(value = "/{id}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AttachmentResponse> uploadTicketAttachment(
            @PathVariable(name = "id") UUID id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ticketService.addAttachment(id, file));
    }

    @GetMapping("/{id}/attachments/{attachmentId}")
    public ResponseEntity<Resource> getTicketAttachment(
            @PathVariable(name = "id") UUID id,
            @PathVariable UUID attachmentId) {
        TicketAttachmentContentResponse response = ticketService.getAttachmentContent(id, attachmentId);
        MediaType contentType = response.contentType() != null
                ? response.contentType()
                : MediaType.APPLICATION_OCTET_STREAM;

        return ResponseEntity.ok()
                .contentType(contentType)
                .cacheControl(CacheControl.maxAge(7, TimeUnit.DAYS).cachePublic())
                .body(response.resource());
    }
}
