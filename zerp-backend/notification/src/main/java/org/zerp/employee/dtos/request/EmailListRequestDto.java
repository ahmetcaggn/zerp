package org.zerp.employee.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailListRequestDto {
    private List<String> toList;
    private String subject;
    private String body;
}
