package org.zerp.sale.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.zerp.common.dto.user.ImageSize;

@FeignClient(name = "thumbor", url = "${user.thumbor.host}")
public interface ThumborFeignClient {

    String ORIGINAL_URL = "/unsafe/${s3.repository.bucket-name}/${app.sale.menu-item-images.folder}/{fileName}";
    String SMALL_URL = "/unsafe/fit-in/100x100/${s3.repository.bucket-name}/${app.sale.menu-item-images.folder}/{fileName}";
    String MEDIUM_URL = "/unsafe/fit-in/300x300/${s3.repository.bucket-name}/${app.sale.menu-item-images.folder}/{fileName}";
    String LARGE_URL = "/unsafe/fit-in/500x500/${s3.repository.bucket-name}/${app.sale.menu-item-images.folder}/{fileName}";
    String SHOP_ORIGINAL_URL = "/unsafe/${s3.repository.bucket-name}/${app.sale.shop-images.folder}/{fileName}";
    String SHOP_SMALL_URL = "/unsafe/fit-in/100x100/${s3.repository.bucket-name}/${app.sale.shop-images.folder}/{fileName}";
    String SHOP_MEDIUM_URL = "/unsafe/fit-in/300x300/${s3.repository.bucket-name}/${app.sale.shop-images.folder}/{fileName}";
    String SHOP_LARGE_URL = "/unsafe/fit-in/500x500/${s3.repository.bucket-name}/${app.sale.shop-images.folder}/{fileName}";

    @GetMapping(ORIGINAL_URL)
    ResponseEntity<byte[]> getProfileImageOriginal(@PathVariable String fileName);

    @GetMapping(SMALL_URL)
    ResponseEntity<byte[]> getProfileImageSmall(@PathVariable String fileName);

    @GetMapping(MEDIUM_URL)
    ResponseEntity<byte[]> getProfileImageMedium(@PathVariable String fileName);

    @GetMapping(LARGE_URL)
    ResponseEntity<byte[]> getProfileImageLarge(@PathVariable String fileName);

    @GetMapping(SHOP_ORIGINAL_URL)
    ResponseEntity<byte[]> getShopImageOriginal(@PathVariable String fileName);

    @GetMapping(SHOP_SMALL_URL)
    ResponseEntity<byte[]> getShopImageSmall(@PathVariable String fileName);

    @GetMapping(SHOP_MEDIUM_URL)
    ResponseEntity<byte[]> getShopImageMedium(@PathVariable String fileName);

    @GetMapping(SHOP_LARGE_URL)
    ResponseEntity<byte[]> getShopImageLarge(@PathVariable String fileName);

    default ResponseEntity<byte[]> getProfileImage(String fileName, ImageSize size) {
        return switch (size) {
            case ORIGINAL -> getProfileImageOriginal(fileName);
            case SMALL -> getProfileImageSmall(fileName);
            case MEDIUM -> getProfileImageMedium(fileName);
            case LARGE -> getProfileImageLarge(fileName);
        };
    }

    default ResponseEntity<byte[]> getShopImage(String fileName, ImageSize size) {
        return switch (size) {
            case ORIGINAL -> getShopImageOriginal(fileName);
            case SMALL -> getShopImageSmall(fileName);
            case MEDIUM -> getShopImageMedium(fileName);
            case LARGE -> getShopImageLarge(fileName);
        };
    }

}
