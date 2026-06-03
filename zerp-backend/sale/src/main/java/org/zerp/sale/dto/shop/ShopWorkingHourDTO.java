package org.zerp.sale.dto.shop;

import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Data
public class ShopWorkingHourDTO {
    private DayOfWeek dayOfWeek;
    private LocalTime opensAt;
    private LocalTime closesAt;
    private boolean openAllDay;
}
