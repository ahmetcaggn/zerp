import 'package:dart_network_layer_dio/dart_network_layer_dio.dart';

final class PageResponse<T extends Schema> {
  factory PageResponse({
    required PageRequest req,
    required List<T> items,
    int? totalCount,
  }) {
    totalCount ??= items.length;
    return PageResponse._(
      items: items,
      totalCount: totalCount,
      totalPages: (totalCount / (req.end - req.start)).ceil(),
      currentPage: (req.start / (req.end - req.start)).floor(),
    );
  }

  PageResponse._({
    required this.items,
    required this.totalCount,
    required this.totalPages,
    required this.currentPage,
  });

  final List<T> items;
  final int totalCount;
  final int totalPages;
  final int currentPage;

  @override
  String toString() {
    return 'PageResponse('
        'totalCount: $totalCount, '
        'totalPages: $totalPages, '
        'currentPage: $currentPage, '
        'items: $items'
        ')';
  }
}

final class PageRequest {
  const PageRequest({
    required this.start,
    required this.end,
  });

  /// The maximum number of records that can be fetched in a single request.
  /// This is used as a practical upper bound for fetching all records.
  static const int _maxRecordLimit = 1_000_000;

  static const PageRequest all = PageRequest(start: 0, end: _maxRecordLimit);

  final int start;
  final int end;

  Map<String, dynamic> toQueryParams() {
    return {
      'page': start,
      'size': end,
    };
  }
}
