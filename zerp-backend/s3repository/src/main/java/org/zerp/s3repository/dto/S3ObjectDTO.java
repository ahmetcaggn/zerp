package org.zerp.s3repository.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class S3ObjectDTO {
    private byte[] data;
    private String contentType;
}
