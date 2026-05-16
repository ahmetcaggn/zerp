package org.zerp.s3repository.configuration;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

@Log4j2
@Configuration
@RequiredArgsConstructor
public class S3Initialize {
    private final S3RepositoryProperties properties;
    private final S3Client s3Client;

    @PostConstruct
    public void init() {
        try {
            s3Client.createBucket(CreateBucketRequest.builder().bucket(properties.bucketName()).build());
        } catch (S3Exception e) {
            if (e.awsErrorDetails().errorCode().equals("BucketAlreadyOwnedByYou")) {
                log.debug("Bucket '{}' already exists and is owned by you. Skipping bucket creation.",
                        properties.bucketName());
            } else {
                throw e;
            }
        } catch (IllegalArgumentException e) {
            log.warn("Bucket name '{}' is not valid. Skipping bucket creation: {}",
                    properties.bucketName(), e.getMessage());
        }
    }
}