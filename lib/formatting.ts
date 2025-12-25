/**
 * Format currency to Indonesian Rupiah
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format currency without symbol
 */
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('id-ID').format(amount);
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  return parseInt(value.replace(/\D/g, '')) || 0;
}

/**
 * Format phone number to Indonesian format
 */
export function formatPhone(phone: string): string {
  // Remove non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format: 0812-3456-7890
  if (cleaned.length === 11 || cleaned.length === 12) {
    return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  
  return phone;
}

/**
 * Validate Indonesian phone number
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return /^(08|62)\d{9,11}$/.test(cleaned);
}

/**
 * Format date to Indonesian format
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Format Firestore Timestamp to readable date
 */
export function formatTimestamp(timestamp: any): string {
  if (!timestamp) return '-';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return formatDate(date);
}

/**
 * Get month name in Indonesian
 */
export function getMonthName(monthIndex: number): string {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return months[monthIndex] || '';
}

/**
 * Format date to "DD MMM" format (e.g., "25 Jan")
 */
export function formatDueDate(date: Date): string {
  const day = date.getDate();
  const month = getMonthName(date.getMonth()).substring(0, 3);
  return `${day} ${month}`;
}

/**
 * Check if date is overdue
 */
export function isOverdue(dueDateString: string): boolean {
  // Assuming format "DD MMM" or "DD Month"
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  // Parse the due date
  const parts = dueDateString.split(' ');
  if (parts.length !== 2) return false;
  
  const day = parseInt(parts[0]);
  const monthName = parts[1];
  
  // Get month index
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthIndex = months.findIndex(m => monthName.startsWith(m));
  
  if (monthIndex === -1) return false;
  
  const dueDate = new Date(currentYear, monthIndex, day);
  
  // If due date is in the past month and we're in a new month, it's overdue
  if (monthIndex < currentMonth) {
    return true;
  }
  
  // If same month, check the day
  if (monthIndex === currentMonth && day < today.getDate()) {
    return true;
  }
  
  return false;
}

/**
 * Get status badge color
 */
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'lunas':
    case 'active':
      return '#10b981'; // green
    case 'belum lunas':
    case 'pending':
      return '#f59e0b'; // orange
    case 'terlambat':
    case 'overdue':
    case 'inactive':
      return '#ef4444'; // red
    default:
      return '#6b7280'; // gray
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Generate random color for avatar
 */
export function generateColor(text: string): string {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e'
  ];
  
  const hash = text.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
