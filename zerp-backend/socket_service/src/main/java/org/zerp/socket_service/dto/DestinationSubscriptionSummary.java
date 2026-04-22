package org.zerp.socket_service.dto;

public record DestinationSubscriptionSummary(
        String destination,
        String nodeId,
        long localSubscriberCount,
        long totalSubscriberCount
) {
}
