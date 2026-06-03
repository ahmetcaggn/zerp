package org.zerp.common.entity.sale;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Data
@Embeddable
public class ShopWorkingHour {
    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false)
    private DayOfWeek dayOfWeek;

    @Column(name = "opens_at", nullable = false)
    private LocalTime opensAt;

    @Column(name = "closes_at", nullable = false)
    private LocalTime closesAt;

    @Column(name = "is_open_all_day", nullable = false)
    private boolean openAllDay;
}
