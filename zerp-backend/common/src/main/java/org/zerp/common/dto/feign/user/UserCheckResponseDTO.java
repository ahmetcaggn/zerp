package org.zerp.common.dto.feign.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCheckResponseDTO {
    /**
     * true if the user already exist and all required fields are valid, false otherwise.
     */
    private Boolean valid;
}
