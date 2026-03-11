package org.zerp.notification.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailSingleRequestDto {
    private String to;
    private String subject;
    private String body;
}
