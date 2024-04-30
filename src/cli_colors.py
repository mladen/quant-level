class CLIColors:
    """Defines ANSI escape codes for CLI background colors."""

    RESET = "\033[0m"  # Reset to default
    BLACK = "\033[40m"  # Black background
    RED = "\033[41m"  # Red background
    GREEN = "\033[42m"  # Green background
    YELLOW = "\033[43m"  # Yellow background
    BLUE = "\033[44m"  # Blue background
    MAGENTA = "\033[45m"  # Magenta background
    CYAN = "\033[46m"  # Cyan background
    WHITE = "\033[47m"  # White background

    @staticmethod
    def colorize(text, color_code):
        """Apply a specified color code to the given text."""
        return color_code + text + CLIColors.RESET


# Example usage:
if __name__ == "__main__":
    print(CLIColors.colorize("Hello, Red Background!", CLIColors.RED))
    print(CLIColors.colorize("Hello, Green Background!", CLIColors.GREEN))
    print(CLIColors.colorize("Hello, Blue Background!", CLIColors.BLUE))
