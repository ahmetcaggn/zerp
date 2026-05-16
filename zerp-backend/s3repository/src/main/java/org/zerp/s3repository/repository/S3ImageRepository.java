package org.zerp.s3repository.repository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.tika.Tika;
import org.zerp.s3repository.configuration.mime.AllowedImageTypes;
import org.zerp.s3repository.configuration.S3RepositoryProperties;
import org.zerp.s3repository.dto.S3FileDTO;
import org.zerp.s3repository.dto.S3ObjectDTO;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.util.UUID;

/**
 * Repository for managing image files in S3.
 * <p>
 * Create a {@link AllowedImageTypes} bean for configuring allowed image types.
 */
@Log4j2
@Repository
@RequiredArgsConstructor
public class S3ImageRepository {
    private final S3Client s3Client;
    private final S3RepositoryProperties s3Properties;
    private final Tika tika;
    private final AllowedImageTypes allowedImageTypes;

    /**
     * Create a new image in the given folder.
     *
     * @param folder The folder to save the image in S3. Null or empty string for root.
     * @param data   The image data as a byte array.
     * @return The DTO containing the generated file name (key).
     */
    public S3FileDTO create(String folder, byte[] data) {
        log.trace("Creating new image with data size: {} bytes", data.length);

        // Detect MIME type from actual content
        String detectedType = tika.detect(data);

        String extension = allowedImageTypes.getExtensionIfAllowed(detectedType);
        if (extension == null) {
            throw new IllegalArgumentException("Unsupported image type: " + detectedType);
        }

        String key = UUID.randomUUID() + extension;
        log.debug("Generated unique S3 key for upload: '{}'", key);
        String fullKey = _createFullKey(folder, key);
        log.debug("Computed full S3 key for upload: '{}'", fullKey);

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(s3Properties.bucketName())
                        .key(fullKey)
                        .contentType(detectedType)
                        .build(),
                RequestBody.fromBytes(data));

        log.info("Created new image with key: {}", key);
        return new S3FileDTO(folder, key);
    }

    /**
     * Update an existing image by its key in the given folder.
     *
     * @param folder The folder where the image is stored in S3. Null or empty string for root.
     * @param key    The key of the image to update.
     * @param data   The new image data as a byte array.
     * @return The DTO containing the file name (key).
     */
    public S3FileDTO update(String folder, String key, byte[] data) {
        log.trace("Updating image with key: {}", key);

        delete(folder, key);
        return create(folder, data);
    }

    /**
     * Delete an image by its key from the given folder.
     *
     * @param folder The folder where the image is stored in S3. Null or empty string for root.
     * @param key    The key of the image to delete.
     */
    public void delete(String folder, String key) {
        log.trace("Deleting image with key: {}", key);

        String fullKey = _createFullKey(folder, key);
        log.debug("Computed full S3 key for deletion: {}", fullKey);

        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(s3Properties.bucketName())
                .key(fullKey)
                .build());
        log.info("Deleted image with key: {}", key);
    }

    public S3ObjectDTO getByFullKey(String fullKey) {
        log.trace("Reading image with full key: {}", fullKey);

        ResponseBytes<GetObjectResponse> response = s3Client.getObjectAsBytes(
                GetObjectRequest.builder()
                        .bucket(s3Properties.bucketName())
                        .key(fullKey)
                        .build()
        );

        return new S3ObjectDTO(response.asByteArray(), response.response().contentType());
    }

    private String _createFullKey(String folder, String key) {
        if (folder == null || folder.isEmpty()) {
            return key;
        } else if (!folder.endsWith("/")) {
            folder += "/";
        }
        return folder + key;
    }
}
