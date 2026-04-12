package org.pomocra.socket_service.dto;

import org.pomocra.common.friendship.PresenceStatus;

public record PrivacySettingChangedEvent(
        Long userId,
        PresenceStatus presenceStatus
) {
}
