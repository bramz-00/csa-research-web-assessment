FROM php:8.4-apache

# Install extensions required (pdo_mysql) and other useful packages
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git \
    && docker-php-ext-install pdo pdo_mysql mysqli \
    && a2enmod rewrite

# Set working dir
WORKDIR /var/www/html

# Copy custom Apache config

# Copy composer if you want (optional)
# COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

EXPOSE 80
