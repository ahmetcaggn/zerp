package org.zerp.user.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.zerp.common.dto.feign.user.UserCheckResponseDTO;
import org.zerp.common.dto.feign.user.UserCreateIfNotExistRequestDTO;
import org.zerp.common.entity.user.AppUser;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    /**
     * Convert AppUser entity to UserCheckResponseDTO
     */
    UserCheckResponseDTO toUserCheckResponseDTO(AppUser appUser);

    /**
     * Convert UserCreateIfNotExistRequestDTO to AppUser entity
     */
    AppUser toEntity(UserCreateIfNotExistRequestDTO dto);

    /**
     * Convert list of AppUser entities to list of UserCheckResponseDTOs
     */
    List<UserCheckResponseDTO> toUserCheckResponseDTOs(List<AppUser> appUsers);

    /**
     * Update an existing AppUser entity from UserCreateIfNotExistRequestDTO
     */
    void updateEntityFromDTO(UserCreateIfNotExistRequestDTO dto, @MappingTarget AppUser appUser);
}
