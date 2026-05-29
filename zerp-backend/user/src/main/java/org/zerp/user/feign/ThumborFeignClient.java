package org.zerp.user.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "thumbor", url = "${user.thumbor.host}")
public interface ThumborFeignClient {

    @GetMapping("/unsafe/{folder}/{fileName}")
    ResponseEntity<byte[]> getFile(@PathVariable String folder, @PathVariable String fileName);

}
