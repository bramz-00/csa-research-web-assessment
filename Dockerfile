FROM php:8.4-apache

# Installer PDO MySQL + extensions utiles
RUN docker-php-ext-install pdo_mysql mysqli

# Activer mod_rewrite (pour .htaccess si tu veux)
RUN a2enmod rewrite

# Copier tout le projet dans le container
COPY . /var/www/html/

# Donner les bons droits
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 777 /var/www/html/uploads