using System;
using System.Security.Cryptography;
using System.Text;

class Program
{
    private const string LowercaseChars = "abcdefghijklmnopqrstuvwxyz"; // lower-case alphabet
    private const string UppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // upper-case alphabet
    private const string DigitChars = "0123456789"; // numeric digits
    private const string SymbolChars = "!@#$%^&*()-_=+[]{};:,.<>?"; // safe symbols

    static void Main()
    {
        Console.WriteLine("Random Password Generator"); // improved title for clarity

        while (true)
        {
            if (!TryReadPasswordOptions(out PasswordOptions options))
            {
                Console.WriteLine("Failed to read valid options. Exiting...");
                return;
            }

            string password = GeneratePassword(options); // separated generation logic
            Console.WriteLine($"\nGenerated password: {password}");

            if (!ConfirmYesNo("Generate another password? (y/n): "))
            {
                break; // allow the user to exit cleanly
            }

            Console.WriteLine();
        }
    }

    private static bool TryReadPasswordOptions(out PasswordOptions options)
    {
        options = default;

        // use validated input instead of int.Parse to avoid runtime exceptions
        if (!TryReadPositiveInt("Enter password length (8-128): ", 8, 128, out int length))
        {
            return false;
        }

        // ask interactive questions for character set preferences
        bool includeLowercase = ConfirmYesNo("Include lowercase letters? (y/n): ");
        bool includeUppercase = ConfirmYesNo("Include uppercase letters? (y/n): ");
        bool includeDigits = ConfirmYesNo("Include digits? (y/n): ");
        bool includeSymbols = ConfirmYesNo("Include symbols? (y/n): ");
        bool excludeAmbiguous = ConfirmYesNo("Exclude ambiguous characters (O,0,l,1,I)? (y/n): ");

        // validate that at least one character set is selected
        if (!includeLowercase && !includeUppercase && !includeDigits && !includeSymbols)
        {
            Console.WriteLine("Error: You must select at least one character type.");
            return false;
        }

        options = new PasswordOptions
        {
            Length = length,
            IncludeLowercase = includeLowercase,
            IncludeUppercase = includeUppercase,
            IncludeDigits = includeDigits,
            IncludeSymbols = includeSymbols,
            ExcludeAmbiguousChars = excludeAmbiguous
        };

        return true;
    }

    private static bool TryReadPositiveInt(string prompt, int minValue, int maxValue, out int result)
    {
        result = 0;

        Console.Write(prompt);
        string? input = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(input) || !int.TryParse(input, out int value))
        {
            Console.WriteLine("Invalid number. Please enter a valid integer.");
            return false;
        }

        if (value < minValue || value > maxValue)
        {
            Console.WriteLine($"Please enter a value between {minValue} and {maxValue}.");
            return false;
        }

        result = value;
        return true;
    }

    private static bool ConfirmYesNo(string prompt)
    {
        while (true)
        {
            Console.Write(prompt);
            string? input = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(input))
            {
                Console.WriteLine("Please answer 'y' or 'n'.");
                continue;
            }

            string normalized = input.Trim().ToLowerInvariant();
            if (normalized is "y" or "yes")
            {
                return true;
            }

            if (normalized is "n" or "no")
            {
                return false;
            }

            Console.WriteLine("Please answer 'y' or 'n'.");
        }
    }

    private static string GeneratePassword(PasswordOptions options)
    {
        string characterPool = BuildCharacterPool(options); // separate character set building
        if (characterPool.Length == 0)
        {
            throw new InvalidOperationException("No characters available for password generation.");
        }

        return BuildRandomString(characterPool, options.Length); // secure generation
    }

    private static string BuildCharacterPool(PasswordOptions options)
    {
        StringBuilder pool = new StringBuilder();

        if (options.IncludeLowercase)
        {
            pool.Append(LowercaseChars);
        }

        if (options.IncludeUppercase)
        {
            pool.Append(UppercaseChars);
        }

        if (options.IncludeDigits)
        {
            pool.Append(DigitChars);
        }

        if (options.IncludeSymbols)
        {
            pool.Append(SymbolChars);
        }

        string poolText = pool.ToString();
        if (options.ExcludeAmbiguousChars)
        {
            poolText = RemoveAmbiguousCharacters(poolText); // remove visually confusing chars
        }

        return poolText;
    }

    private static string BuildRandomString(string characterPool, int length)
    {
        StringBuilder password = new StringBuilder(length);

        // use RandomNumberGenerator for cryptographically secure password generation
        for (int i = 0; i < length; i++)
        {
            int index = RandomNumberGenerator.GetInt32(characterPool.Length);
            password.Append(characterPool[index]);
        }

        return password.ToString();
    }

    private static string RemoveAmbiguousCharacters(string input)
    {
        // remove characters that are often hard to distinguish visually
        return input
            .Replace("O", string.Empty)
            .Replace("0", string.Empty)
            .Replace("l", string.Empty)
            .Replace("1", string.Empty)
            .Replace("I", string.Empty);
    }

    private readonly struct PasswordOptions
    {
        public int Length { get; init; }
        public bool IncludeLowercase { get; init; }
        public bool IncludeUppercase { get; init; }
        public bool IncludeDigits { get; init; }
        public bool IncludeSymbols { get; init; }
        public bool ExcludeAmbiguousChars { get; init; }
    }
}
