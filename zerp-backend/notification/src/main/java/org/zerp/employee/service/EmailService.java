package org.zerp.employee.service;

import org.zerp.employee.dtos.request.EmailEmployeeListRequestDto;
import org.zerp.employee.dtos.response.TemplateDto;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String EMAIL_FROM;

    public void sendErrorMail(EmailEmployeeListRequestDto emailRequestDto) {

        String subject = "[ALERT] " + emailRequestDto.getErrorType() + " type Detected in System";
        String timestamp = java.time.LocalDateTime.now().toString();

        // Plain text body
        String plainText = plainTextTemplate(timestamp, new TemplateDto(emailRequestDto));
        // HTML body
        String htmlBody = htmlTemplate(timestamp, new TemplateDto(emailRequestDto));

        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(emailRequestDto.getEmailToList().toArray(String[]::new));
            helper.setSubject(subject);
            helper.setFrom(EMAIL_FROM);
            helper.setText(plainText, htmlBody);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private String plainTextTemplate(String timestamp, TemplateDto emailRequestDto) {
        return String.format(
                "Dear Team,\n\n" +
                        "A fatal error has been detected in the system.\n\n" +
                        "Details:\n" +
                        "- Timestamp: %s\n" +
                        "- Service: %s\n" +
                        "- Error Code: %s\n" +
                        "- Message: %s\n\n" +
                        "Immediate attention is required to investigate and resolve the issue.\n\n" +
                        "Best regards,\n" +
                        "System Monitoring Bot",
                timestamp, emailRequestDto.getServiceName(), emailRequestDto.getErrorCode(), emailRequestDto.getErrorMessage()
        );
    }

    private String htmlTemplate(String timestamp, TemplateDto emailRequestDto) {
        return String.format(
                "<html>" +
                        "<body style='font-family: Arial, sans-serif; background-color: #f6f8fa; padding: 20px;'>" +
                        "  <div style='background-color: #ffffff; border-radius: 8px; padding: 20px; border: 1px solid #e1e4e8;'>" +
                        "    <div style='font-size: 20px; font-weight: bold; color: #d73a49;'>⚠️ %s Error Detected</div>" +
                        "    <div style='margin-top: 20px; font-size: 14px; color: #24292e;'>" +
                        "      <p><strong>Timestamp:</strong> %s</p>" +
                        "      <p><strong>Service:</strong> %s</p>" +
                        "      <p><strong>Error Code:</strong> %s</p>" +
                        "      <p><strong>Message:</strong> %s</p>" +
                        "    </div>" +
                        "    <div style='margin-top: 30px; font-size: 12px; color: #586069;'>" +
                        "      Please investigate the issue immediately.<br><br>" +
                        "      Regards,<br>" +
                        "      System Monitoring Bot" +
                        "    </div>" +
                        "  </div>" +
                        "</body>" +
                        "</html>",
                emailRequestDto.getErrorType().name(), timestamp, emailRequestDto.getServiceName(), emailRequestDto.getErrorCode(), emailRequestDto.getErrorMessage()
        );
    }

    private String htmlTemplateWithStackTrace(String timestamp, TemplateDto emailRequestDto) {
        return String.format(
                "<html>" +
                        "<body style='font-family: Arial, sans-serif; background-color: #f6f8fa; padding: 20px;'>" +
                        "  <div style='background-color: #ffffff; border-radius: 8px; padding: 20px; border: 1px solid #e1e4e8;'>" +
                        "    <div style='font-size: 20px; font-weight: bold; color: #d73a49;'>⚠️ %s Error Detected</div>" +
                        "    <div style='margin-top: 20px; font-size: 14px; color: #24292e;'>" +
                        "      <p><strong>Timestamp:</strong> %s</p>" +
                        "      <p><strong>Service:</strong> %s</p>" +
                        "      <p><strong>Error Code:</strong> %s</p>" +
                        "      <p><strong>Message:</strong> %s</p>" +
                        "    </div>" +
                        "    <div style='margin-top: 20px;'>" +
                        "      <h4 style='font-size: 14px; font-weight: bold; color: #0366d6;'>Stack Trace:</h4>" +
                        "      <pre style='font-size: 12px; background-color: #f1f1f1; padding: 10px; border-radius: 5px; " +
                        "                   overflow-x: auto; white-space: pre-wrap; color: #24292e; border: 1px solid #d1d5da;'>" +
                        "        %s" +
                        "      </pre>" +
                        "    </div>" +
                        "    <div style='margin-top: 30px; font-size: 12px; color: #586069;'>" +
                        "      Please investigate the issue immediately.<br><br>" +
                        "      Regards,<br>" +
                        "      System Monitoring Bot" +
                        "    </div>" +
                        "  </div>" +
                        "</body>" +
                        "</html>"
,
                emailRequestDto.getErrorType().name(), timestamp, emailRequestDto.getServiceName(), emailRequestDto.getErrorCode(), emailRequestDto.getErrorMessage(),emailRequestDto.getExceptionStackTrace()
        );
    }

    /**
     * Tek bir kişiye mail gönderir
     * @param to Alıcı email adresi
     * @param subject Mail konusu
     * @param body Mail içeriği
     */
    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom(EMAIL_FROM);
            helper.setText(body);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email to: " + to, e);
        }
    }

    /**
     * Birden fazla kişiye plain text mail gönderir
     * @param toList Alıcı email adresleri listesi
     * @param subject Mail konusu
     * @param body Mail içeriği (plain text)
     */
    public void sendEmailToList(List<String> toList, String subject, String body) {
        if (toList == null || toList.isEmpty()) {
            throw new IllegalArgumentException("Recipient list cannot be null or empty");
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toList.toArray(String[]::new));
            helper.setSubject(subject);
            helper.setFrom(EMAIL_FROM);
            helper.setText(body);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email to list", e);
        }
    }

    /**
     * Birden fazla kişiye HTML formatında mail gönderir
     * @param toList Alıcı email adresleri listesi
     * @param subject Mail konusu
     * @param plainTextBody Plain text içerik (fallback)
     * @param htmlBody HTML içerik
     */
    public void sendEmailToListWithHtml(List<String> toList, String subject, String plainTextBody, String htmlBody) {
        if (toList == null || toList.isEmpty()) {
            throw new IllegalArgumentException("Recipient list cannot be null or empty");
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toList.toArray(String[]::new));
            helper.setSubject(subject);
            helper.setFrom(EMAIL_FROM);
            helper.setText(plainTextBody, htmlBody);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send HTML email to list", e);
        }
    }
}
