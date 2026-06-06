package org.zerp.common.entity.notification;
 
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
 
public enum AnnouncementRecipientMode {
    ALL,
    EMPLOYEES;
 
    @JsonCreator
    public static AnnouncementRecipientMode fromJson(String value) {
        if (value == null) {
            return null;
        }
        return AnnouncementRecipientMode.valueOf(value.trim().toUpperCase());
    }
 
    @JsonValue
    public String toJson() {
        return name().toLowerCase();
    }
}
