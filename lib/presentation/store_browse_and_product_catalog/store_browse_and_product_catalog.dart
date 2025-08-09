import 'package:flutter/material.dart';
import 'package:sizer/sizer.dart';

import '../../core/app_export.dart';
import './widgets/category_chip_widget.dart';
import './widgets/filter_bottom_sheet_widget.dart';
import './widgets/floating_cart_badge_widget.dart';
import './widgets/product_card_widget.dart';
import './widgets/search_bar_widget.dart';
import './widgets/store_header_widget.dart';

class StoreBrowseAndProductCatalog extends StatefulWidget {
  const StoreBrowseAndProductCatalog({Key? key}) : super(key: key);

  @override
  State<StoreBrowseAndProductCatalog> createState() =>
      _StoreBrowseAndProductCatalogState();
}

class _StoreBrowseAndProductCatalogState
    extends State<StoreBrowseAndProductCatalog> with TickerProviderStateMixin {
  final ScrollController _scrollController = ScrollController();
  final ScrollController _categoryScrollController = ScrollController();

  String _searchQuery = '';
  Map<String, dynamic> _activeFilters = {};
  List<String> _selectedCategories = [];
  int _cartItemCount = 0;
  bool _isLoading = false;
  bool _isLoadingMore = false;

  // Mock store data
  final Map<String, dynamic> _storeData = {
    "id": 1,
    "name": "Fresh Market Accra",
    "rating": 4.5,
    "deliveryTime": "25-35 min",
    "imageUrl":
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3",
  };

  // Mock categories data
  final List<Map<String, dynamic>> _categories = [
    {"name": "All", "count": 0},
    {"name": "Fruits", "count": 12},
    {"name": "Vegetables", "count": 18},
    {"name": "Dairy", "count": 8},
    {"name": "Meat", "count": 6},
    {"name": "Bakery", "count": 15},
    {"name": "Beverages", "count": 20},
    {"name": "Snacks", "count": 25},
  ];

  // Mock products data
  final List<Map<String, dynamic>> _allProducts = [
    {
      "id": 1,
      "name": "Fresh Bananas",
      "price": "GHS 8.50",
      "imageUrl":
          "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3",
      "category": "Fruits",
      "inStock": true,
      "rating": 4.2,
    },
    {
      "id": 2,
      "name": "Organic Tomatoes",
      "price": "GHS 12.00",
      "imageUrl":
          "https://images.unsplash.com/photo-1546470427-e26264be0b0d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3",
      "category": "Vegetables",
      "inStock": true,
      "rating": 4.5,
    },
    {
      "id": 3,
      "name": "Fresh Milk 1L",
      "price": "GHS 6.50",
      "imageUrl":
          "https://images.unsplash.com/photo-1550583724-b2692b85b150?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3",
      "category": "Dairy",
      "inStock": false,
      "rating": 4.0,
    },
    {
      "id": 4,
      "name": "Chicken Breast",
      "price": "GHS 25.00",
      "imageUrl":
          "https://images.unsplash.com/photo-1604503468506-a8da13d82791?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3",
      "category": "Meat",
      "inStock": true,
      "rating": 4.3,
    },
    {
      "id": 5,
      "name": "Whole Wheat Bread",
      "price": "GHS 4.50",
      "imageUrl":
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3",
      "category": "Bakery",
      "inStock": true,
      "rating": 4.1,
    },
    {
      "id": 6,
      "name": "Orange Juice 500ml",
      "price": "GHS 7.00",
      "imageUrl":
          "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3",
      "category": "Beverages",
      "inStock": true,
      "rating": 4.4,
    },
    {
      "id": 7,
      "name": "Plantain Chips",
      "price": "GHS 5.50",
      "imageUrl":
          "https://images.unsplash.com/photo-1566478989037-eec170784d0b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3",
      "category": "Snacks",
      "inStock": true,
      "rating": 4.0,
    },
    {
      "id": 8,
      "name": "Red Onions",
      "price": "GHS 3.50",
      "imageUrl":
          "https://images.unsplash.com/photo-1518977676601-b53f82aba655?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3",
      "category": "Vegetables",
      "inStock": true,
      "rating": 4.2,
    },
  ];

  List<Map<String, dynamic>> _filteredProducts = [];

  @override
  void initState() {
    super.initState();
    _filteredProducts = List.from(_allProducts);
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _categoryScrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      _loadMoreProducts();
    }
  }

  void _loadMoreProducts() {
    if (_isLoadingMore) return;

    setState(() => _isLoadingMore = true);

    // Simulate loading more products
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) {
        setState(() => _isLoadingMore = false);
      }
    });
  }

  void _filterProducts() {
    setState(() {
      _filteredProducts = _allProducts.where((product) {
        // Search query filter
        if (_searchQuery.isNotEmpty) {
          final productName = (product['name'] as String).toLowerCase();
          if (!productName.contains(_searchQuery.toLowerCase())) {
            return false;
          }
        }

        // Category filter
        if (_selectedCategories.isNotEmpty &&
            !_selectedCategories.contains('All')) {
          final productCategory = product['category'] as String;
          if (!_selectedCategories.contains(productCategory)) {
            return false;
          }
        }

        // Price range filter
        if (_activeFilters.containsKey('minPrice') &&
            _activeFilters.containsKey('maxPrice')) {
          final priceString =
              (product['price'] as String).replaceAll('GHS ', '');
          final price = double.tryParse(priceString) ?? 0.0;
          final minPrice = (_activeFilters['minPrice'] as num).toDouble();
          final maxPrice = (_activeFilters['maxPrice'] as num).toDouble();
          if (price < minPrice || price > maxPrice) {
            return false;
          }
        }

        return true;
      }).toList();
    });
  }

  void _onSearchChanged(String query) {
    setState(() => _searchQuery = query);
    _filterProducts();
  }

  void _onCategorySelected(String category) {
    setState(() {
      if (category == 'All') {
        _selectedCategories.clear();
        _selectedCategories.add('All');
      } else {
        _selectedCategories.remove('All');
        if (_selectedCategories.contains(category)) {
          _selectedCategories.remove(category);
        } else {
          _selectedCategories.add(category);
        }
        if (_selectedCategories.isEmpty) {
          _selectedCategories.add('All');
        }
      }
    });
    _filterProducts();
  }

  void _onCategoryRemoved(String category) {
    setState(() {
      _selectedCategories.remove(category);
      if (_selectedCategories.isEmpty) {
        _selectedCategories.add('All');
      }
    });
    _filterProducts();
  }

  void _showFilterBottomSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => FilterBottomSheetWidget(
        currentFilters: _activeFilters,
        onFiltersApplied: (filters) {
          setState(() => _activeFilters = filters);
          _filterProducts();
        },
      ),
    );
  }

  void _onProductTap(Map<String, dynamic> product) {
    // Navigate to product detail with shared element transition
    // Navigator.pushNamed(context, '/product-detail', arguments: product);
  }

  void _onAddToCart(Map<String, dynamic> product) {
    setState(() => _cartItemCount++);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${product['name']} added to cart'),
        duration: const Duration(seconds: 2),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _onAddToWishlist(Map<String, dynamic> product) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${product['name']} added to wishlist'),
        duration: const Duration(seconds: 2),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _onShareProduct(Map<String, dynamic> product) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Sharing ${product['name']}'),
        duration: const Duration(seconds: 2),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _onVoiceSearch() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Voice search activated'),
        duration: Duration(seconds: 2),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _onCartTap() {
    Navigator.pushNamed(context, '/shopping-cart-and-checkout');
  }

  Future<void> _onRefresh() async {
    setState(() => _isLoading = true);

    // Simulate refresh
    await Future.delayed(const Duration(seconds: 1));

    setState(() {
      _isLoading = false;
      _filteredProducts = List.from(_allProducts);
    });
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(8.w),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CustomIconWidget(
              iconName: 'search_off',
              color: AppTheme.lightTheme.colorScheme.onSurface
                  .withValues(alpha: 0.3),
              size: 64,
            ),
            SizedBox(height: 2.h),
            Text(
              'No products found',
              style: AppTheme.lightTheme.textTheme.titleMedium?.copyWith(
                color: AppTheme.lightTheme.colorScheme.onSurface
                    .withValues(alpha: 0.6),
              ),
            ),
            SizedBox(height: 1.h),
            Text(
              'Try adjusting your search or filters',
              style: AppTheme.lightTheme.textTheme.bodyMedium?.copyWith(
                color: AppTheme.lightTheme.colorScheme.onSurface
                    .withValues(alpha: 0.5),
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 3.h),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  _searchQuery = '';
                  _selectedCategories.clear();
                  _selectedCategories.add('All');
                  _activeFilters.clear();
                });
                _filterProducts();
              },
              child: const Text('Browse All Categories'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProductGrid() {
    if (_filteredProducts.isEmpty) {
      return _buildEmptyState();
    }

    return GridView.builder(
      controller: _scrollController,
      padding: EdgeInsets.all(4.w),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 4.w,
        mainAxisSpacing: 4.w,
        childAspectRatio: 0.75,
      ),
      itemCount: _filteredProducts.length + (_isLoadingMore ? 2 : 0),
      itemBuilder: (context, index) {
        if (index >= _filteredProducts.length) {
          return Container(
            decoration: BoxDecoration(
              color: AppTheme.lightTheme.colorScheme.surface
                  .withValues(alpha: 0.5),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(
              child: CircularProgressIndicator(
                color: AppTheme.lightTheme.primaryColor,
              ),
            ),
          );
        }

        final product = _filteredProducts[index];
        return ProductCardWidget(
          product: product,
          onTap: () => _onProductTap(product),
          onAddToCart: () => _onAddToCart(product),
          onAddToWishlist: () => _onAddToWishlist(product),
          onShare: () => _onShareProduct(product),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.lightTheme.scaffoldBackgroundColor,
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                // Store Header
                StoreHeaderWidget(
                  storeData: _storeData,
                  onBackPressed: () => Navigator.pop(context),
                ),

                // Search Bar
                SearchBarWidget(
                  hintText: 'Search products...',
                  onSearchChanged: _onSearchChanged,
                  onFilterPressed: _showFilterBottomSheet,
                  onVoicePressed: _onVoiceSearch,
                ),

                // Category Chips
                Container(
                  height: 6.h,
                  padding: EdgeInsets.symmetric(vertical: 1.h),
                  child: ListView.builder(
                    controller: _categoryScrollController,
                    scrollDirection: Axis.horizontal,
                    padding: EdgeInsets.symmetric(horizontal: 4.w),
                    itemCount: _categories.length,
                    itemBuilder: (context, index) {
                      final category = _categories[index];
                      final categoryName = category['name'] as String;
                      final count = category['count'] as int;
                      final isSelected =
                          _selectedCategories.contains(categoryName);

                      return CategoryChipWidget(
                        category: categoryName,
                        count: count,
                        isSelected: isSelected,
                        onTap: () => _onCategorySelected(categoryName),
                        onRemove: () => _onCategoryRemoved(categoryName),
                      );
                    },
                  ),
                ),

                // Product Grid
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _onRefresh,
                    color: AppTheme.lightTheme.primaryColor,
                    child: _buildProductGrid(),
                  ),
                ),
              ],
            ),

            // Floating Cart Badge
            FloatingCartBadgeWidget(
              itemCount: _cartItemCount,
              onTap: _onCartTap,
            ),
          ],
        ),
      ),
    );
  }
}
