package org.zerp.sale.dto.publicsale;

import lombok.Data;

import java.util.List;

@Data
public class PublicShopFeedResponseDTO {
    private List<PublicShopDTO> items;
    private int page;
    private int pageSize;
    private Integer nextPage;
    private int totalPages;
    private boolean hasMore;
    private long total;
}
