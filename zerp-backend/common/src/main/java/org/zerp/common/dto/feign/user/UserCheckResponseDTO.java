package org.zerp.common.dto.feign.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserCheckResponseDTO {
    /**
     * true if the user already exist and all required fields are valid, false otherwise.
     */
    private Boolean valid;
}
