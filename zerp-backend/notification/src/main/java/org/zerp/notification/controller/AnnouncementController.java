package org.zerp.notification.controller;
 
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.notification.dtos.request.announcement.CreateAnnouncementRequestDto;
import org.zerp.notification.dtos.response.announcement.AnnouncementResponseDto;
import org.zerp.notification.service.AnnouncementService;
 
import java.util.UUID;
 
@RestController
@RequestMapping("/notification/announcements")
@RequiredArgsConstructor
public class AnnouncementController extends ResourceController<AnnouncementResponseDto, AnnouncementResponseDto,
        CreateAnnouncementRequestDto, CreateAnnouncementRequestDto, UUID> {
    private final AnnouncementService announcementService;
 
    @Override
    protected AnnouncementService getService() {
        return announcementService;
    }
}
