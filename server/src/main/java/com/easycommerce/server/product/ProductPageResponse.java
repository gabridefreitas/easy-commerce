package com.easycommerce.server.product;

import java.util.List;

public record ProductPageResponse(List<Product> items, int currentPage, int totalPages) {
}
