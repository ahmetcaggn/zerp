extension StringExtension on String {
  String firstCharsSafe(int index) {
    if (length < index) {
      return this;
    } else {
      return substring(0, index);
    }
  }
}
