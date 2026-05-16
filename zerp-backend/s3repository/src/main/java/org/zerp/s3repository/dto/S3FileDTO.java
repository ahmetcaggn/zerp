package org.zerp.s3repository.dto;

import lombok.Data;

@Data
public class S3FileDTO {
    private String folder;
    private String fileName;
    private String fullKey;

    public S3FileDTO(String folder, String fileName) {;
        if (folder != null && folder.endsWith("/")) {
            folder = folder.substring(0, folder.length() - 1);
        }
        this.folder = folder;
        this.fileName = fileName;
        if (folder == null || folder.isEmpty()) {
            this.fullKey = fileName;
        } else {
            this.fullKey = folder + "/" + fileName;
        }
    }
}
