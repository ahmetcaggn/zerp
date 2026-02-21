package org.zerp.employee.controller;

import org.zerp.employee.dtos.request.EmailEmployeeListRequestDto;
import org.zerp.employee.dtos.request.EmailListHtmlRequestDto;
import org.zerp.employee.dtos.request.EmailListRequestDto;
import org.zerp.employee.dtos.request.EmailSingleRequestDto;
import org.zerp.employee.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
public class EmailController {
    private final EmailService emailService;

    @PostMapping("/send")
    public EmailEmployeeListRequestDto sendEmail(@RequestBody EmailEmployeeListRequestDto emailRequest) {
        emailService.sendErrorMail(emailRequest);
        System.out.println("Email request: " + emailRequest);
        return emailRequest;
    }

    @PostMapping("/sendToList")
    public ResponseEntity<?> sendEmailToList(@RequestBody EmailListRequestDto emailRequest) {
        emailService.sendEmailToList(emailRequest.getToList(), emailRequest.getSubject(), emailRequest.getBody());
        return ResponseEntity.ok(true);
    }

    @PostMapping("/sendToListHtml")
    public ResponseEntity<?> sendEmailToListWithHtml(@RequestBody EmailListHtmlRequestDto emailRequest) {
        emailService.sendEmailToListWithHtml(
                emailRequest.getToList(),
                emailRequest.getSubject(),
                emailRequest.getPlainTextBody(),
                emailRequest.getHtmlBody()
        );
        return ResponseEntity.ok(true);
    }

    @PostMapping("/sendSingle")
    public ResponseEntity<?> sendSingleEmail(@RequestBody EmailSingleRequestDto emailRequest) {
        emailService.sendEmail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getBody());
        return ResponseEntity.ok(true);
    }
}
