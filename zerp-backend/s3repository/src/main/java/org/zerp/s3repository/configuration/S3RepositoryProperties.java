package org.zerp.s3repository.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

@ConfigurationProperties("s3.repository")
public record S3RepositoryProperties(
        @NonNull String endpoint,
        @NonNull String bucketName,
        @Nullable String region,
        @NonNull String username,
        @NonNull String password
) {
    @Override
    @NonNull
    public String toString() {
        return "S3RepositoryProperties{" +
                "endpoint='" + endpoint + '\'' +
                ", bucketName='" + bucketName + '\'' +
                ", region='" + region + '\'' +
                ", username='[PROTECTED]'" +
                ", password='[PROTECTED]'" +
                '}';
    }
}
